import { Request, Response, NextFunction } from 'express';
import pc from 'picocolors';
import DBManager from './components/database';

import type bark from '@/index';
import { timestamp, color } from '@/components';
import { options } from '@/options';
import { timeStamp } from 'console';

export async function debug(msg: string) {
  const colorFormat = color.format(options.value.colors?.debug);
  let ts = timestamp.now();

  console.log(colorFormat(
    `DEBUG: ` +
    `${ts}` +
    msg
  ));

  const db = DBManager.getInstance();
  (await db).addLog(ts, msg, 'DEBUG');
}

export async function info(msg: string) {
  const colorFormat = color.format(options.value.colors?.info);
  let ts = timestamp.now();

  console.log(colorFormat(
    `INFO: ` +
    `${ts}` +
    msg
  ));

  const db = DBManager.getInstance();
  (await db).addLog(ts, msg, 'INFO');
}

export async function warn(msg: string) {
  const colorFormat = color.format(options.value.colors?.warn);
  let ts = timestamp.now();

  console.log(colorFormat(
    `WARN: ` +
    `${ts}` +
    msg
  ));

  const db = DBManager.getInstance();
  (await db).addLog(ts, msg, 'WARN');
}

export async function error(msg: string) {
  const colorFormat = color.format(options.value.colors?.error);
  let ts = timestamp.now();

  console.log(colorFormat(
    `ERROR: ` +
    `${ts}` +
    msg
  ));

  const db = DBManager.getInstance();
  (await db).addLog(ts, msg, 'ERROR');
}

export default (newOptions: bark.Options = {}) => {
  options.value = { ...options.value, ...newOptions };
  const db = DBManager.getInstance();

  const prefix = options.value.prefix!;

  return async (req: Request, res: Response, next: NextFunction) => {
    let startTimeString = timestamp.now();
    let startTime = Date.now();
    const colorFormat = color.format(options.value.colors?.http);

    console.log(colorFormat(
      `${prefix} REQ: ` +
      `${startTimeString}` +
      `${req.method} ` +
      `${req.url}`
    ));
    
    let message: string = `REQ: ${req.method} ${req.url}`;
    (await db).addLog(startTimeString, message , prefix);

    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;

      let statusColor = pc.green;

      if (status >= 500) {
        statusColor = pc.red;
      } else if (status >= 400) {
        statusColor = pc.yellow;
      } else if (status >= 300) {
        statusColor = pc.cyan;
      }

      let endTimeString = timestamp.now();

      console.log(colorFormat(
        `${prefix} RES: ` +
        `${endTimeString}` +
        `${req.method} ` +
        `${req.url} ` +
        `${statusColor(status.toString())} ` +
        `${pc.gray(`- ${duration}ms`)}`
      ));

      (await db).addLog(endTimeString, `RES: ${req.method} ${status.toString()} ${req.url} - ${duration}ms`, prefix);
    });

    next();
  };
};