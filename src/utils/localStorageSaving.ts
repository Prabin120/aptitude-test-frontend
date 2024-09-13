
const gettingStorageValue = (key: string) : string|null =>{
    const value = localStorage.getItem(key);
    if(value === null) return null;
    if(value === 'undefined') return null;
    return value;
}

const settingStorageValue = (key: string, value:string): void=>{
    localStorage.setItem(key, value);
}

const deletingStorageValue = (key: string): void=>{
    localStorage.removeItem(key);
}

export {gettingStorageValue, settingStorageValue, deletingStorageValue}