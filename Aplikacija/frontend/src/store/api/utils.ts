export const providesList = <
  T extends string,
  R extends { id: string | number }[]
>(
  tagType: T,
  resultsWithIds?: R | undefined,
  customTagId?: string
) => {
  const tagId = customTagId ?? `LIST${tagType.toUpperCase()}`;

  if (!resultsWithIds) {
    return [{ type: tagType, id: tagId }];
  }

  return resultsWithIds
    ? [
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
        { type: tagType, id: tagId },
      ]
    : [{ type: tagType, id: tagId }];
};

export const providesSingle = <R extends string | number, T extends string>(
  tagType: T,
  resultId?: R | undefined,
  customTagId?: string
) => {
  const tagId = customTagId ?? `LIST${tagType.toUpperCase()}`;
  return resultId
    ? [
        { type: tagType, id: resultId },
        { type: tagType, id: tagId },
      ]
    : [{ type: tagType, id: tagId }];
};
