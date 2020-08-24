export default class DropDownHolder {
  static dropDown = null;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  static getDropDown() {
    return this.dropDown;
  }
}
