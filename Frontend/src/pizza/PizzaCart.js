/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var storage = require("basil.js");
storage = new storage();

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};


//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

var Info = {
    total_count: 0,
    total_price: 0
};

//HTML едемент куди будуть додаватися піци
var $cart = $("#one_card");

function addToCart(pizza, size) {
    Info.total_price += pizza[size].price;
    //Додавання однієї піци в кошик покупок
    for (var i = 0; i < Cart.length; i++) {
        var item = Cart[i];
        if (item.pizza === pizza && item.size === size) {
            item.quantity += 1;
            return updateCart();
        }
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });
    Info.total_count += 1;

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    var removeInd = Cart.indexOf(cart_item);
    if (removeInd > -1) {
        Cart.splice(removeInd, 1);
        Info.total_price -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
        Info.total_count -= 1;
        //Після видалення оновити відображення
        updateCart();
    }
}

function initialiseCart() {
    var saved_orders = storage.get("one_card");
    if(saved_orders){
        Cart = saved_orders;
        Info = storage.get("cart_info");
        updateCart();
    }
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    $(".right-panel .orders .badge.all-orders-count span").text(Info.total_count);
    $(".right-panel .order-state .sum-number span").text(Info.total_price);
    //Очищаємо старі піци в кошику
    $cart.html("");


    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            Info.total_price += cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function () {
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity === 1) {
                removeFromCart(cart_item)
                return updateCart();
            }
            cart_item.quantity -= 1;
            Info.total_price -= cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();

        });
        $node.find(".count-clear").click(function () {
            $node.remove();
            removeFromCart(cart_item);
        });

        $(".all-orders-clear").click(function () {
            for (var i = 0; i < Cart.length; i++) {
                $node.remove();
                removeFromCart(Cart[0]);
            }

        });
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    storage.set("one_card", Cart);
    storage.set("cart_info", Info);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;