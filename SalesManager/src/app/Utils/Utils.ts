export class Utils {
  constructor() {}
  public IsNumericKey(key: string): boolean {
    return !/[1-9]/.test(key) ? false : true;
  }
}
