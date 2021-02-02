/**
 *
 * @param {number} milliseconds
 */
function sleep(milliseconds:number):void {
  const start = new Date().getTime();
  for (let i = 0; i < 1e30; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

export default sleep;
