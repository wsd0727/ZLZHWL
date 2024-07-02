import request from "@/utils/request";

//查询左侧车辆树
export function getTreeData(data) {
  return request({
    url: "/tms/tmsTransportDoing/getDoingCarTree",
    method: "post",
    data,
  });
}

// 查询车辆轨迹
export function getPath(data) {
  return request({
    url: "/tms/tmsTransportPoints/getPointByCar",
    method: "post",
    data,
  });
}

// 查询在途车辆
export function getDrivingCars(data) {
  return request({
    url: "/tms/tmsTransportDoing/getDoingCarPoints",
    method: "post",
    data,
  });
}
