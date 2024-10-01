const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
let { record_id_counter, request_id_counter } = require("../datas/counters.json")

const updateIDCounters = () => {
    fs.writeFileSync('./datas/counters.json', JSON.stringify({
        record_id_counter: record_id_counter,
        request_id_counter: request_id_counter,
    }));
}

module.exports = {
    getRecordsDate : (date) => {
        date.setHours(0,0,0,0) //setTime to 00:00 a.m.
        const date_string = date.toISOString();
        date.setDate(date.getDate()+1);

        return prisma.booking_record.findMany({
            where : {
                AND : {
                    at : {
                        lte : date.toISOString(),
                        gte : date_string
                    },
                    visible : {
                        equals : true
                    }
                }
            }
        })
    },
    getRecordsAuthor : (author) => {
        return prisma.booking_record.findMany({
            where : {
                author : {
                    equals : author
                }
            }
        })
    },
    getRecordId : (record_id) => {
        return prisma.booking_record.findFirst({
            where : {
                record_id : {
                    equals : record_id
                }
            }
        })
    },
    addRecord : async (data, visible) => {
        record_id_counter++;
        updateIDCounters();

        return prisma.booking_record.create({
            data : {
                record_id : record_id_counter - 1,
                at : new Date(data.date).toISOString(),
                from_time : data.from_time,
                to_time : data.to_time,
                room : data.room,
                author : data.author,
                title : data.title,
                description : data.description,
                visible : visible
            }
        })
    },
    removeRecord : async (record_id) => {
        return prisma.booking_record.delete({
            where : {
                record_id : record_id
            }
        })
    },
    updateRecord : async (record_id, data) => {
        return prisma.booking_record.update({
            where: {
                record_id: record_id
            },
            data: data
        })
    },

    addRequest : async (author, reason, type, status, record_id_1, record_id_2) => {
        request_id_counter++;
        updateIDCounters();

        return prisma.requests.create({
            data: {
                request_id: request_id_counter - 1,
                record_id_1: record_id_1,
                record_id_2: record_id_2,
                author: author,
                reason: reason,
                status: status,
                type: type,
            }
        })
    },
    getRequestsAuthor: async (username) => {
        return prisma.requests.findMany({
            where: {
                author: {
                    equals: username,
                }
            },
            orderBy: [{
                request_id: "desc",   
            }]
        });
    },
    getRequestsNotification: async (username) => {
        return prisma.requests.findMany({
            where: {
                AND : {
                    author: {
                        equals: username,
                    },
                    NOT: {
                        status: {
                            equals: 0
                        }
                    }
                },
            },
            orderBy: [{
                request_id: "desc",   
            }]
        });
    },
    getRequestId: async (request_id) => {
        return prisma.requests.findFirst({
            where: {
                request_id: request_id
            }
        })
    },
    getRequests: async () => {
        return prisma.requests.findMany({
            orderBy: [
                {
                    request_id: "desc"
                }
            ]
        });
    },
    removeRequest: async (request_id) => {
        return prisma.requests.delete({
            where: {
                request_id: request_id,
            }
        })
    },
    confirmRequest: async (request_id, reviewed_by) => {
        return prisma.requests.update({
            where: {
                request_id: request_id
            },
            data: {
                reviewed_by: reviewed_by,
                status: 2,
            }
        })
    },
    rejectRequest: async (request_id, reviewed_by, reason) => {
        return prisma.requests.update({
            where: {
                request_id: request_id
            },
            data: {
                reviewed_by: reviewed_by,
                reason: reason,
                status: 1,
            }
        })
    }
}