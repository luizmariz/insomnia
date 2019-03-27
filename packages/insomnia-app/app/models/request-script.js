// @flow
import * as db from '../common/database';
import type { BaseModel } from './index';

export const script = 'Folder';
export const type = 'RequestScript';
export const prefix = 'scr';
export const canDuplicate = true;

type BaseRequestScript = {
  script: string,
  metaSortKey: number,
};

export type RequestScript = BaseModel & BaseRequestScript;

export function init() {
  return {
    script: ' ',
    environment: {},
    metaSortKey: -1 * Date.now(),
  };
}

export function migrate(doc: RequestScript) {
  return doc;
}

export function create(patch: Object = {}): Promise<RequestScript> {
  if (!patch.parentId) {
    throw new Error('New RequestScript missing `parentId`: ' + JSON.stringify(patch));
  }

  return db.docCreate(type, patch);
}

export function update(requestScript: RequestScript, patch: Object = {}): Promise<RequestScript> {
  return db.docUpdate(requestScript, patch);
}

export function getById(id: string): Promise<RequestScript | null> {
  return db.get(type, id);
}

export function findByParentId(parentId: string): Promise<Array<RequestScript>> {
  return db.find(type, { parentId });
}

export function remove(requestScript: RequestScript): Promise<void> {
  return db.remove(requestScript);
}

export function all(): Promise<Array<RequestScript>> {
  return db.all(type);
}
