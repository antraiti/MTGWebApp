//these are util functions to convert our stored time strings to various display formats

//Gets just the local time (for match card start/stop display)
export default function LocalTime(datestring) {
    return (new Date(datestring)).toLocaleTimeString();
}

//Returns local date and time
export function LocalDateTime(datestring) {
    return (new Date(datestring)).toLocaleString();
}

//Returns local date
export function LocalDate(datestring) {
    return (new Date(datestring)).toLocaleDateString();
}