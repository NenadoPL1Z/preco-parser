"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTeacherDB = exports.setScheduleDB = exports.getScheduleData = exports.getGroupListData = exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const app_1 = require("../../app");
const sendSuccessResponse = (res) => {
    return ({ key = "data", data }) => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.json({ [key]: data });
    };
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res) => {
    return (status, error) => {
        res.status(status);
        res.json({ error });
    };
};
exports.sendErrorResponse = sendErrorResponse;
const getGroupListData = (selector = "#id_listgroups") => {
    const result = [];
    const innerSelectElement = document.querySelector(selector);
    const optionElementsArr = innerSelectElement.children;
    for (let i = 0; i < optionElementsArr.length; i++) {
        const optionElement = optionElementsArr[i];
        result.push({
            text: optionElement.textContent || "",
            value: optionElement.value,
        });
    }
    return result;
};
exports.getGroupListData = getGroupListData;
const getScheduleData = () => {
    const CONTAINER_SELECTOR = ".urk_shedule";
    const CURRENT_DATE_SELECTOR = ".urk_sheduledate";
    const CURRENT_LESSON_SELECTOR = ".urk_lessonblock";
    const CURRENT_LESSON_TIME_SELECTOR = ".urk_timewindow";
    const CURREN_LESSON_DESCRIPTION_SELECTOR = ".urk_lessondescription";
    const schedulesData = [];
    const schedulesElement = document.querySelector(CONTAINER_SELECTOR);
    if (!schedulesElement) {
        return schedulesData;
    }
    const schedulesChildren = schedulesElement.children;
    for (let i = 0; i < schedulesChildren.length; i++) {
        const scheduleItem = { date: "", lessons: [] };
        const scheduleItemElement = schedulesChildren[i];
        const date = scheduleItemElement.querySelector(CURRENT_DATE_SELECTOR);
        scheduleItem.date = date?.textContent || "";
        const lessonsNodeArr = scheduleItemElement.querySelectorAll(CURRENT_LESSON_SELECTOR);
        for (let j = 0; j < lessonsNodeArr.length; j++) {
            const lesson = {
                count: null,
                timeStart: null,
                timeEnd: null,
                name: null,
            };
            const currentLessonElem = lessonsNodeArr[j];
            const lessonNameElement = currentLessonElem.querySelector(CURREN_LESSON_DESCRIPTION_SELECTOR);
            const lessonTimeElement = currentLessonElem.querySelector(CURRENT_LESSON_TIME_SELECTOR);
            const lessonTimeChildren = lessonTimeElement?.children || [];
            lesson.name = lessonNameElement?.textContent || "";
            lesson.count = lessonTimeChildren[0]?.textContent;
            lesson.timeStart = lessonTimeChildren[1]?.textContent;
            lesson.timeEnd = lessonTimeChildren[2]?.textContent;
            scheduleItem.lessons.push(lesson);
        }
        schedulesData.push(scheduleItem);
    }
    return schedulesData;
};
exports.getScheduleData = getScheduleData;
const setScheduleDB = async (result, date) => {
    if (result) {
        await app_1.ScheduleModel.update({
            ruUpdateTime: date,
            result,
        }, { where: { id: 1 } })
            .then(() => {
            console.log("success save");
        })
            .catch(() => {
            console.log("error save");
        });
    }
    else {
        console.log("empty result");
    }
};
exports.setScheduleDB = setScheduleDB;
const setTeacherDB = async (result, date) => {
    if (result) {
        await app_1.TeacherModel.update({
            ruUpdateTime: date,
            result,
        }, { where: { id: 1 } })
            .then(() => {
            console.log("success save");
        })
            .catch((e) => {
            console.log("error save");
        });
    }
    else {
        console.log("empty result");
    }
};
exports.setTeacherDB = setTeacherDB;
//# sourceMappingURL=services.js.map