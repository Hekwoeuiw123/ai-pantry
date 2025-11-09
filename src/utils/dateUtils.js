import {parseISO,differenceInDays,isPast,isToday} from 'date-fns'

export default  function getExpiryStatus(expiryDate){
    if(!expiryDate){ return 'safe' }

    const date = parseISO(expiryDate) // convert '2025-11-08 ' into new Date(expiryDate)
    const today = new Date();
          
    // isPast chk krega ki given date ho chuka hai kya 
    // isToday chk karega ki given date aaj ka din hai kya 
    if (isPast(date) && !isToday(date)) {
        return 'expired'
    }
    
    const daysUntil = differenceInDays(date, today);

    if(daysUntil <= 3 && daysUntil >= 0){
        return 'expiring_soon'
    }
    return 'safe'
}