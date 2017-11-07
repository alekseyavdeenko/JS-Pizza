/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#one_card");

function addToCart(pizza, size) {
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


    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    var removeInd = Cart.indexOf(cart_item);
    if (removeInd > -1) {
        Cart.splice(removeInd, 1);
        //Після видалення оновити відображення
        updateCart();
    }
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function () {
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity === 1) {
                removeFromCart(cart_item)
            }
            cart_item.quantity -= 1;
            //Оновлюємо відображення
            updateCart();

        });
        $node.find(".count-clear").click(function () {
            $node.remove();
            removeFromCart(cart_item);
        });

        $node.find(".all-orders-clear").click(function () {
            for (var i = 0; i < Cart.length; i++) {
                removeFromCart(Cart[i])
            }

        });
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;