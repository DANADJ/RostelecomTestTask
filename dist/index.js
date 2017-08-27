'use strict';

(function (Document) {

    /**
     * @const {object} Ids - Объект с идентификаторами используемыми на странице
     */
    var Ids = {
        appId: '#app',
        mainContainerId: '#main-container',
        resultListId: '#result-list',
        downloadButtonId: '#download-button'
    };

    /**
     * @const {object} Classes - Объект с классами используемыми в приложении
     */
    var Classes = {
        deleteButton: 'delete-button',
        itemsWidth25: 'items-width-25',
        itemsWidth33: 'items-width-33',
        itemsWidth50: 'items-width-50',
        itemsWidth100: 'items-width-100'
    };

    /**
     * @property {(null|array)} currentJSON - Загруженный с сервера массив элементов списка
     * @property {number} itemCounter - Счётчик отображённых элементов
     */
    var currentJSON = null,
        itemCounter = 0;

    /**
     * @property {object} elements - Карта объектов элементов страницы
     * @property {(object|null)} elements.app - Главный контейнер приложения
     * @property {(object|null)} elements.resultList - Список результатов
     * @property {(object|null)} elements.downloadButton - Кнопка загрузки следующих элементов
     */
    var elements = {
        app: null,
        resultList: null,
        downloadButton: null
    };

    /**
     * Объект с разметкой используемой в приложении
     */
    var Markup = {

        /**
         * @description Метод возвращает разметку для одного элемента списка
         * @method resultListItem
         *
         * @param {object} itemObject - Объект элемента списка
         * @param {string} itemObject.id - Идентификатор элемента списка
         * @param {string} itemObject.imageUrl - Ссылка на изображение элемента списка
         * @param {string} itemObject.name - Заголовок элемента списка
         * @param {string} itemObject.text - Описание элемента списка
         *
         * @return {string}
         */
        resultListItem: function resultListItem(itemObject) {

            return '<li class="result-list_item"  id="' + itemObject.id + '">\n                      <div class="result-list_item-content" style="background-image: url(' + itemObject.imageUrl + ')">\n                        <div class="preview-container">\n                          <div class="preview">\n                            <p class="preview_title">' + itemObject.name + '</p>\n                            <p class="preview_description">' + itemObject.text + '</p>\n                            <div class="toolbar">\n                              <button type="button" class="' + Classes.deleteButton + '" data-id="' + itemObject.id + '">DEL</button>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </li>';
        },


        /**
         * @description Метод возвращает разметку одного блока с элементами списка
         * @method resultListItemsBlock
         *
         * @return {string}
         */
        resultListItemsBlock: function resultListItemsBlock() {

            var content = '',
                counter = 0,
                itemsWithClass = '';

            for (; counter < 4; counter++) {

                if (itemCounter !== currentJSON.length) {
                    content += this.resultListItem(currentJSON[itemCounter++]);
                } else {
                    break;
                }
            }

            if (counter === 1) {

                itemsWithClass = Classes.itemsWidth100;
            } else if (counter === 2) {

                itemsWithClass = Classes.itemsWidth50;
            } else if (counter === 3) {

                itemsWithClass = Classes.itemsWidth33;
            } else if (counter === 4) {

                itemsWithClass = Classes.itemsWidth25;
            }

            return '<div class="items-block clearfix ' + itemsWithClass + '">' + content + '</div>';
        },


        /**
         * @description Метод возвращает основную разметку приложения
         * @method mainMarkup
         *
         * @return {string}
         */
        mainMarkup: function mainMarkup() {
            return '<div class="main-container" id="' + Ids.mainContainerId.substr(1) + '">\n\t                  <ul class="result-list" id="' + Ids.resultListId.substr(1) + '">' + this.resultListItemsBlock() + '</ul>\n\t                  <div class="toolbar">\n\t\t                <button type="button" class="toolbar_button--download" id="' + Ids.downloadButtonId.substr(1) + '">Download</button>\n\t                  </div>\n                    </div>';
        }
    };

    /**
     * @description Функция собирает и инициализирует всё приложение
     * @function initApp
     */
    function initApp() {
        if (elements.app) {

            elements.app.innerHTML = Markup.mainMarkup();

            initElements();
            initDownloadButtonHandler();
            initDeleteButtonHandler();
        }
    }

    /**
     * @description Функция добавляет в список элементов следующий блок с элементми списка
     * @function buildResultListItemBlock
     */
    function buildResultListItemBlock() {

        if (itemCounter !== currentJSON.length) {
            elements.resultList.innerHTML = Markup.resultListItemsBlock() + elements.resultList.innerHTML;
        }
    }

    /**
     * @description Функция удаляет элемент списка
     * @function removeResultListItem
     *
     * @param {object} event - Объект события
     */
    function removeResultListItem(event) {

        var currentElement = event.target;

        if (currentElement.classList.contains(Classes.deleteButton)) {

            var targetElementId = currentElement.dataset.id,
                targetElement = document.getElementById(targetElementId),
                parentElement = targetElement.parentElement;

            parentElement.removeChild(targetElement);

            if (parentElement.classList.contains(Classes.itemsWidth25)) {

                parentElement.classList.remove(Classes.itemsWidth25);
                parentElement.classList.add(Classes.itemsWidth33);
            } else if (parentElement.classList.contains(Classes.itemsWidth33)) {

                parentElement.classList.remove(Classes.itemsWidth33);
                parentElement.classList.add(Classes.itemsWidth50);
            } else if (parentElement.classList.contains(Classes.itemsWidth50)) {

                parentElement.classList.remove(Classes.itemsWidth50);
                parentElement.classList.add(Classes.itemsWidth100);
            } else if (parentElement.classList.contains(Classes.itemsWidth100)) {

                parentElement.parentElement.removeChild(parentElement);
            }
        }
    }

    /**
     * @description Функция инициализирует обработчик события клика по кнопке "Download"
     * @function initDownloadButtonHandler
     */
    function initDownloadButtonHandler() {

        if (elements.downloadButton) {

            elements.downloadButton.addEventListener('click', buildResultListItemBlock);
        }
    }

    /**
     * @description Функция инициализирует обработчик события клика по кнопке "Download"
     * @function initDeleteButtonHandler
     */
    function initDeleteButtonHandler() {

        if (elements.resultList) {

            elements.resultList.addEventListener('click', removeResultListItem);
        }
    }

    /**
     * @description - Функция находит на странице все нужные для работы элементы и сохраняет их в объекте "elements"
     * @function initElements
     */
    function initElements() {
        elements.resultList = document.querySelector(Ids.resultListId);
        elements.downloadButton = document.querySelector(Ids.downloadButtonId);
    }

    /**
     * @description - Коллбэк вызываемый при получении данных от сервера.
     * @callback serverResponseCallback
     */
    function serverResponseCallback() {

        if (this.response) {
            currentJSON = this.response;

            elements.app = document.getElementById(Ids.appId.substr(1));

            initApp();
        }
    }

    /**
     * @description - Функция создаёт, настраивает и отправляет AJAX запрос к серверу
     * @function serverRequest
     */
    function serverRequest() {

        var xhr = new XMLHttpRequest();
        xhr.open('get', 'http://81.177.101.143/test.json', true);
        xhr.responseType = "json";
        xhr.onload = serverResponseCallback;
        xhr.send();
    }

    /**
     * Действия запускающиеся после полной загруз DOM дерева
     */
    Document.addEventListener('DOMContentLoaded', function () {

        /**
         * Загрузка JSON объекта
         */
        serverRequest();
    });
})(document);