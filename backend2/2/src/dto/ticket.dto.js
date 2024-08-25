export const ticketDto = (ticket) => {
    const date = (ticket.purchase_datatime);

    return {
        purchaser_email: ticket.purchaser,
        amount: ticket.amount,
        security_code: ticket.code,
        date: date.getDate()+"/"+(date.getMonth() + 1)+"/"+date.getFullYear()+" ( "+date.getHours()+" : "+date.getMinutes()+" )",
    }
}