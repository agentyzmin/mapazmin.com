(function() {
    'use strict';

    var module = angular.module('app.i18n', []);

    module.factory('i18n', [function() {
        var common, map, people, buildings, facades, accessibility, parking, trees, streets;

        common = {
            homePageTitle: 'Мапа змін',
            chartTotal: 'Всього:',
            allFilters: 'Всі',
            absolute: 'Абсолютно',
            percent: 'Відсотки',
            peopleFilterTitle: 'Люди',
            buildingsFilterTitle: 'Будівлі',
            areaFilterTitle: 'Територія',
            objectsFilterTitle: 'Об’єкти'
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
            unit: 'осіб'
        };

        buildings = {
            filterName: 'Функція',
            ruin: 'Руїни',
            housing: 'Житло',
            culture: 'Культура',
            garage: 'Гаражі',
            cafe: 'Кафе',
            office: 'Офіси',
            unit: 'м2'
        };

        facades = {
            filterName: 'Активність фасадів',
            active: 'Активний',
            tolerable: 'Дружній',
            nothing: 'Змішаний',
            dopey: 'Нудний',
            inactive: 'Неактивний',
            unit: 'м.'
        };

        accessibility = {
            filterName: 'Доступність',
            roads: 'Дороги',
            open: 'Легкодосяжні',
            hardToReach: 'Важкодоступні',
            unreachable: 'Недосяжні',
            unit: 'м2'
        };

        parking = {
            filterName: 'Парковки',
            yard: 'Подвір’я',
            street: 'Вулиця',
            unit: 'од.'
        };

        trees = {
            filterName: 'Дерева',
            l: 'Великі',
            m: 'Середні',
            s: 'Малі',
            unit: 'од.'
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

        function i18n(set) {
            return function(key) {
                if (!set[key]) {
                    console.error('i18n: Key not found: ' + key);
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
            streets: i18n(streets)
        }
    }]);
}());