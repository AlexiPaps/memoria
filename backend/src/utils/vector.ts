import { EMBEDDING_DIMENSIONS } from "./constants";

export const ZERO_EMBEDDING = Array(EMBEDDING_DIMENSIONS).fill(0) as number[];

export const isValidEmbedding = (vec: number[] | null | undefined): vec is number[] =>
    Array.isArray(vec) && vec.length === EMBEDDING_DIMENSIONS;