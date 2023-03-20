import { StorageMgr } from "../storage/StorageMgr";

export default class DataBase{
    private _saveKey:string;
    private _delaytime:number= 0;
    public saveDelay:number = 1000;
    constructor(saveKey:string)
    {
        this._saveKey = saveKey;
    }

    public decode(json?)
    {
        let localJson = StorageMgr.get(this._saveKey);
        if (localJson) {
            localJson = JSON.parse(localJson);
        }
        if (!json) {
            json = localJson;
        } else {
            json = JSON.parse(json);
        }
        if (localJson && (localJson['_updateTime'] >= json._updateTime)) {
            json = localJson;
        }
        if (json)
        {
            for(var key in json)
            {
                this[key] = json[key];
            }
        }
    }

    public get te():number
    {
        return 1;
    }

    public encode():any
    {
        var data: any = {};
        
        var user = JSON.parse(JSON.stringify(this));
        for(var key in user)
        {
            if(key== "_saveKey" || key== "saveDelay" || key == "_delaytime" || key == "instance") continue;
            data[key] = user[key];
        }
        return data;
    }

    public delaySave()
    {
        if(this._delaytime == 0)
        {
            this._delaytime = setTimeout(this.save.bind(this), this.saveDelay);
        }
        this['_updateTime'] = Math.floor(new Date().getTime());
        // let data = this.encode();
        // cc.sys.localStorage.setItem(this._saveKey, JSON.stringify(data));
    }

    public save()
    {
        this._delaytime = 0;
        let data = this.encode();
        StorageMgr.set(this._saveKey, JSON.stringify(data));
    }
}