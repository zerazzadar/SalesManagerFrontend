export class Utils {
  constructor() {}
  public IsNumericKey(key: string): boolean {
    return !/[0-9]/.test(key) ? false : true;
  }
}
