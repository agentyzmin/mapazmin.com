(function() {
    'use strict';

    var module = angular.module('app.i18n', []);

    module.factory('i18n', ['$sce', function($sce) {
        var common, map, people, buildings, facades, accessibility, parking, trees, streets, footer;

        common = {
            homePageTitle: 'Мапа змін',
            homePageSubTitle: 'Інструмент для оцінки міських даних',
            chartTotal: 'Всього:',
            allFilters: 'Всі',
            value: 'Значення:',
            absolute: 'Абсолютно',
            percent: 'У відсотках',
            peopleFilterTitle: 'Люди:',
            buildingsFilterTitle: 'Будівлі:',
            areaFilterTitle: 'Територія:',
            objectsFilterTitle: 'Об’єкти:',
            researchInProgress: 'Дослідження триває'
        };

        map = {
            street: 'Вулиця: ',
            streets: 'Вулиці: ',
            area: 'Площа: ',
            length: 'Довжина: ',
            category: 'Категорія: ',
            m2: 'м2',
            m: 'м'
        };

        people = {
            filterName: 'Зайнятість',
            students: 'Учні',
            workers: 'Працівники',
            residents: 'Мешканці',
            unit: 'осіб',
            people: 'Люди'
        };

        buildings = {
            filterName: 'Функція',
            ruin: 'Руїни',
            housing: 'Житло',
            culture: 'Культура',
            garage: 'Господарчі',
            cafe: 'Торгівля',
            office: 'Робота',
            unit: 'га'
        };

        facades = {
            filterName: 'Активність фасадів',
            active: 'Активний',
            tolerable: 'Дружній',
            nothing: 'Змішаний',
            dopey: 'Нудний',
            inactive: 'Неактивний',
            unit: 'км'
        };

        accessibility = {
            filterName: 'Відкритість',
            roads: 'Дороги',
            open: 'Відкрита',
            hardToReach: 'Обмежений доступ',
            unreachable: 'Закрита',
            unit: 'га'
        };

        parking = {
            filterName: 'Парковки',
            yard: 'Подвір’я',
            street: 'Вулиця',
            unit: 'од'
        };

        trees = {
            filterName: 'Дерева',
            l: 'Великі',
            m: 'Середні',
            s: 'Малі',
            unit: 'од'
        };

        streets = {
            'Lypynskoho': 'Липинського',
            'Volodymyrskyi': 'Володимирський',
            'Striletska': 'Стрілецька',
            'Franka': 'Івана Франка',
            'Zolotovoritska': 'Золотоворітська',
            'Reitarska': 'Рейтарська',
            'Kotsiubynskoho': 'Коцюбинського',
            'Sofiivska': 'Софіївська',
            'Stritenska': 'Стрітенська',
            'Irynynska': 'Ірининська',
            'Honchara': 'Гончара',
            'Velyka_Zhytomyrska': 'Велика Житомирська',
            'Khmelnytskogo': 'Хмельницького',
            'Rylskyi_prov': 'Рильський провулок',
            'Malopidvalna': 'Малопідвальна',
            'Prorizna': 'Прорізна',
            'Volodymyrska': 'Володимирська',
            'Lysenka': 'Лисенка',
            'Yaroslaviv_Val': 'Ярославів вал',
            'Bulvarno_Kudriavska': 'Бульварно-Кудрявська',
            'Heorhiivskyi': 'Георгіївський'
        };

        footer = {
            left: $sce.trustAsHtml(
                'Мапу зробили «Агенти змін» для дослідження околиці вулиці Ярославів Вал в Києві. ' +
                'На основі цих даних ми розробимо проект її оновлення. ' +
                'Більше про проект <a href="https://www.facebook.com/new.yarval/">у фейсбуці</a>.'
            ),
            right: $sce.trustAsHtml(
                '<p>Агенти змін</p>' +
                '<p><a href="https://a3.kyiv.ua">a3.kyiv.ua</a></p>' +
                '<p><a href="https://fb.com/agentyzmin">fb.com/agentyzmin</a></p>'
            ),
            title: $sce.trustAsHtml('Про проект'),
            date: $sce.trustAsHtml('2017')
        };

        function i18n(set) {
            return function(key) {
                if (!set[key]) {
                    console.warn('i18n: Key not found: ' + key);
                    return '';
                }

                return set[key];
            }
        }

        return {
            common: i18n(common),
            map: i18n(map),
            people: i18n(people),
            buildings: i18n(buildings),
            facades: i18n(facades),
            accessibility: i18n(accessibility),
            parking: i18n(parking),
            trees: i18n(trees),
            streets: i18n(streets),
            footer: i18n(footer)
        }
    }]);
}());