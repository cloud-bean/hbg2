'use strict';

exports.getMemberAnalysis = function(req, res, next) {
    var memberAnalysis = {
        pieData: [
            {label: '铁杆会员', value: 10.0},
            {label: '年卡会员', value: 55.0},
            {label: '季卡体验会员', value: 20.0 },
            {label: '月卡活动会员', value: 10.0 },
            {label: '合伙人会员', value: 5.0 }
        ],
        barData: [
        {
            name: "会员数量",
            values: [ { x: 2014.10, y: 20 }, { x: 2014.11, y: 40 }, { x: 2014.12, y: 50 },
                { x: 2015.01, y: 50 }, { x: 2015.02, y: 50 },  { x: 2015.02, y: 60 },
                { x: 2015.12, y: 80 } ],
            strokeWidth: 3,
            strokeDashArray: "5,5"
        }]
    };

    res.json(memberAnalysis);
};
