import { v4 as uuidv4 } from "uuid";
import { TicketDAO } from "../dao/factory.js";
const tm = TicketDAO;

export const getTickets = async () => {
    try {
        const tickets = await tm.getTickets();
        if(tickets === []) return {message: 'La base de datos no contiene ningun ticket'};
        return {message: 'Tickets encontrados', payload: tickets};
    } catch(error) {
        throw error;
    }
};

export const getTicketById = async (tid) => {
    try {
        const ticketById = await tm.getTicketById(tid);
        if(Object.keys(ticketById).length === 0) return {message: 'EL ticket no se encuentra en la base de datos'};
        return {message: 'Ticket encontrado', payload: ticketById};
    } catch(error) {
        throw error;
    }
};

export const createTicket = async (ticketInfo) => {
    try {
        const tickets = await getTickets();
        
        let code;
        let uniqueCode = false;
        while (uniqueCode === false) {
            code = uuidv4();
            uniqueCode = tickets.payload.forEach(ticket => ticket.code === code) ? false : true;
        };

        const actualDate = Date();
        const options = {dateStyle: 'short', timeStyle: 'short'};
        const purchase_datetime = actualDate.toLocaleString('es-AR', options);

        const newticketInfo = {
            code,
            purchase_datetime,
            amount: ticketInfo.amount,
            purchaser: ticketInfo.purchaser
        };

        const data = await tm.createTicket(newticketInfo);
        const newTicket = {
            code: data.code,
            purchase_datetime: data.purchase_datetime,
            amount: data.amount,
            purchaser: data.purchaser
        };

        return newTicket;
    } catch(error) {
        throw error;
    }
}