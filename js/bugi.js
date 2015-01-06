Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(document).ready(function () {
    var lossArray = [0];
    var gainArray = [0];

    $("#payment-type .payment-event").each(function () {
        $(this).data("event", {
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

    $("#calendar").fullCalendar({
        header: {
            left: "prev, next, title",
            right: "today, month, agendaWeek, agendaDay"
        },
        selectable: true,
        selectHelper: true,
        droppable: true,
        eventLimit: true,
        eventClick: function(event, element) {
            if ($(this).css("background-color") == "rgb(60, 179, 113)")
                $(this).addClass("income");

            if ($(this).is(".income")) {
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                    '<div class="field"><label for="gainAmount">Amount: </label><input type="number" name="gainAmount" id="paymentAmount" value="0" min="0" /></div>';
            } else {
                var paymentForm = '<div class="field"><label for="paymentName">Name: </label><input type="text" name="paymentName" id="paymentName" value="" maxlength="14"/></div>' +
                    '<div class="field"><label for="lossAmount">Amount: </label><input type="number" name="lossAmount" id="paymentAmount" value="0" min="0" /></div>';
            }

            paymentState = {
                state0: {
                    title: 'Enter payment information:',
                    html: paymentForm,
                    buttons: { Submit: 1 },
                    submit: function(e, v, m, f) {

                        if (f.lossAmount) {
                            var lossTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.lossAmount;
                            f.lossAmount *= -1;
                            lossArray.push(f.lossAmount);
                            $.each(lossArray, function() { lossTotal -= parseFloat(this) || 0; });
                            $("#expensePanel").html("$" + (lossTotal.formatMoney(2)));
                        } else {
                            var gainTotal = 0;
                            event.title = f.paymentName + " " + "$" + f.gainAmount;
                            gainArray.push(f.gainAmount);
                            $.each(gainArray, function() { gainTotal += parseFloat(this) || 0; });
                            $("#incomePanel").html("$" + (gainTotal.formatMoney(2)));
                        }

                        var gainlossTotal = 0;
                        var gainlossArray = gainArray.concat(lossArray);
                        $.each(gainlossArray, function () { gainlossTotal += parseFloat(this) || 0; });

                        if (gainlossTotal > 0) {
                            $(".lossHide").hide();
                            $(".gainHide").show();
                            $("#gainPanel").html("$" + (gainlossTotal.formatMoney(2)));
                        }
                        else {
                            $(".gainHide").hide();
                            $(".lossHide").show();
                            $("#lossPanel").html("$" + (gainlossTotal.formatMoney(2)));
                        }

                        $("#calendar").fullCalendar("updateEvent", event);
                        $.prompt.close();
                    }
                }
            };
            $.prompt(paymentState);
        }
    });
});

// Register and Login Buttons
$(document).ready(function () {
    $("#paymentForm").hide();
    $("#registerPanel").hide();
    $("#loginPanel").hide();
    $(".registerSlide").click(function () {
        $("#registerPanel").slideToggle("slow");
    });

    $(".loginSlide").click(function () {
        $("#loginPanel").slideToggle("slow");
    });
});