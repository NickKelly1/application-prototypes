
/**
 * Dispatch an events value to an object key on the dispatcher
 * 
 * @param dispatcher 
 * @param key 
 */
export function dispatchToKey<T>(dispatcher: React.Dispatch<React.SetStateAction<T>>, key: keyof T) {
  return function doUpdateForm(evt: React.ChangeEvent<HTMLInputElement>) {
    const { value } = evt.target;
    dispatcher((prev) => ({ ...prev, [key]: value }));
  }
}