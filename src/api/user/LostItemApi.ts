import request from '@/utils/axiosUtils';
export interface LostItem{
    itemName:string;
    type:number | null;
    itemDesc:string;
    location:string;
    phone:string;
    image1?:string;
    image2?:string;
    image3?:string;
}

//新增寻物贴接口
export function saveLostItem(params:LostItem){
    return request.post("/lostItem/save",params)

}