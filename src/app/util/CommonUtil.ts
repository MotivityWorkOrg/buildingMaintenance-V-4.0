export class CommonUtil {
  public static isEmptyObject( object ) {
    // We could use Object.keys, but this is more efficient
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

}
