/** Types generated for queries found in "packages/server/postgres/queries/src/upsertPromptResponseQuery.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'UpsertPromptResponseQuery' parameters type */
export interface IUpsertPromptResponseQueryParams {
  response: {
    meetingId: string | null | void,
    userId: string | null | void,
    sortOrder: number | null | void,
    content: Json | null | void
  };
}

/** 'UpsertPromptResponseQuery' return type */
export type IUpsertPromptResponseQueryResult = void;

/** 'UpsertPromptResponseQuery' query type */
export interface IUpsertPromptResponseQueryQuery {
  params: IUpsertPromptResponseQueryParams;
  result: IUpsertPromptResponseQueryResult;
}

const upsertPromptResponseQueryIR: any = {"name":"upsertPromptResponseQuery","params":[{"name":"response","codeRefs":{"defined":{"a":46,"b":53,"line":3,"col":9},"used":[{"a":190,"b":197,"line":6,"col":8}]},"transform":{"type":"pick_tuple","keys":["meetingId","userId","sortOrder","content"]}}],"usedParamSet":{"response":true},"statement":{"body":"INSERT INTO \"TeamPromptResponse\" (\"meetingId\", \"userId\", \"sortOrder\", \"content\")\nVALUES :response","loc":{"a":101,"b":197,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "TeamPromptResponse" ("meetingId", "userId", "sortOrder", "content")
 * VALUES :response
 * ```
 */
export const upsertPromptResponseQuery = new PreparedQuery<IUpsertPromptResponseQueryParams,IUpsertPromptResponseQueryResult>(upsertPromptResponseQueryIR);


