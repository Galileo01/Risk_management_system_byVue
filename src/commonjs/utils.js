export function formatDate(str, fmt) {

    function padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
    const date = new Date(str);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }
    return fmt;
}

//统计函数
export function statistic(data) {
    //风险等级 曲线变化 数据
    const lineData = {
        //近7周
        weekly: {
            1: [0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 0, 0, 0, 0, 0],
            4: [0, 0, 0, 0, 0, 0, 0],
            length: 7,
        },
        //近7月
        monthly: {
            1: [0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 0, 0, 0, 0, 0],
            4: [0, 0, 0, 0, 0, 0, 0],
            length: 7,
        },
        //近4年
        yearly: {
            1: [0, 0, 0, 0],
            2: [0, 0, 0, 0],
            3: [0, 0, 0, 0],
            4: [0, 0, 0, 0],
            length: 4,
        },
    };
    const now = new Date();
    const curMonth = now.getMonth(); //当前月份
    const curYear = now.getFullYear(); //当前 年份
    const curNum = now.getDate(); //当前的 多少号
    const day = now.getDay(); //一周的某一天 , 每周的 第一天为 周日
    const weekFirst = curNum - day; //当前周 第一天的 号数,
    // console.log(weekFirst);
    const weekFirstMs = new Date().setDate(weekFirst); //本周第一天的 距离时间戳的 毫秒数
    for (const item of data) {
        const createTime = new Date(item.createTime);
        const createDate = createTime.getDate();
        const dayDis = Math.floor(
            (createTime.getTime() - weekFirstMs) / (24 * 60 * 60 * 1000)
        ); //距离本周 第一天的天数
        let monthDis = 0; //月数 差距
        if (createTime.getFullYear() === curYear) {
            //年份相同
            monthDis = curMonth - createTime.getMonth();
        } else if (createTime.getFullYear() === curYear - 1) {
            //去年数据
            monthDis = curMonth + 12 - createTime.getMonth();
        }
        const yearDis = curYear - createTime.getFullYear();
        //统计周数据
        if (dayDis >= 0) {
            //dayDis为正，说明是 本周的数据
            // console.log(`dayDis ${dayDis} createTime: ${createTime}`);

            lineData.weekly[item.level][6]++; //7-count-1
        } else {
            //是前几周的 数据
            const count = parseInt(-dayDis / 7); //距离 weekFirst 的周数  0：当前周

            //只记录 近7周的数据
            if (count <= 6) {
                lineData.weekly[item.level][6 - count]++;
                // console.log(
                //     `dayDis:${dayDis},count${count},createTime:${createTime}`
                // );
            }
        }
        //统计月数据
        if (monthDis <= 6) {
            // console.log(monthDis, createTime.getMonth(), item.level);
            lineData.monthly[item.level][6 - monthDis]++;
        }
        //统计 年数据
        if (yearDis <= 3) {
            lineData.yearly[item.level][3 - yearDis]++;
        }
    }
    return lineData;
}


//获取 服务器上的 静态资源的url 
export function getStaticUrl(path) {
    return sessionStorage.getItem('baseURL') + path.slice(49);
}