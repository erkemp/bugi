$(document).ready(function () {
    

    $('#payment-type .payment-event').each(function() {
        $(this).data('event', {
            title: $.trim($(this).text()),
            stick: true,
            editable: true,
            color: $(this).css("background-color")
    });

        $(this).draggable({
            zIndex: 999,
            revert: true,
            revertDuration: 0,
    });

    });

    $('#calendar').fullCalendar({
        header: {
            left: 'prev, next, title',
            right: 'today, month, agendaWeek, agendaDay'
        },
        selectable: true,
        selectHelper: true,
        droppable: true,
        eventLimit: true
    });
});