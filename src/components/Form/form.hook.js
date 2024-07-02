// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    return { url: "", data: {}, importantData: {}, setvalue: [] };
  }
  try {
    let newConfig = Array.isArray(JSON.parse(config)) ? JSON.parse(config)[0] : JSON.parse(config)
    let arr = []
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] })
      }
    }
    return { url: newConfig.url, data: newConfig?.params, importantData: newConfig?.importantData, setvalue: arr }
  } catch (error) {
    if (config.indexOf("/") == '0') {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {},
        setImportantParam = {},
        importantData = {},
        SelectValueTo = [];
      if (paramsArr.length == 0) {
        url = config;
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj
          importantData = importantObj
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj
          setImportantParam = importantObj
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) }
          importantData = { ...importantData, ...ConvertData(setImportantParam) }
        }
        SelectValueTo = paramsArr[3] ? GetUrlParams("a?" + paramsArr[3], "arr") : []
      }
      return { url, data: queryJson, importantData, setvalue: SelectValueTo };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    importantObj = {},
    arr = [];
  url.replace(reg, function () {
    if (arguments[1].includes("!")) {
      let key = arguments[1].substr(1); //删除第一个字符
      importantObj[key] = arguments[2];
    } else {
      obj[arguments[1]] = arguments[2];
    }
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? { obj, importantObj } : arr;
}

const formHook = () => {
  return {
    ParseOtherConfig
  }
}

export default formHook