import moment from "moment";

export function isValueInvalid(valor_hora) {
    const decimal = valor_hora.toString().split(".");
    const isInvalid =
        decimal[0].length > 7 || (decimal[1] && decimal[1].length > 2);
    if (isInvalid) {
        return true;
    }
}

export function getWorkingDays(data_inicio, data_fim, feriados) {
    let initialDate = moment(data_inicio);
    let finalDate = moment(data_fim);
    let days = 0;
    while (initialDate <= finalDate) {
        initialDate = initialDate.add(1, "days");
        const isHoliday = feriados.find((feriado) => feriado === initialDate);

        if (
            initialDate.isoWeekday() !== 6 &&
            initialDate.isoWeekday() !== 7 &&
            !isHoliday
        ) {
            days += 1;
        }
    }
    
    return days;
}
