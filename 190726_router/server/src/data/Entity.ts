export interface Entity<TAttributes, TPrimaryKey extends keyof TAttributes> {
  attributes: TAttributes;
  readonly primaryKey: TPrimaryKey;
}
