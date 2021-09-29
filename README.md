# Документация по проекту "система контроля заболеваний и посещения сотрудников"

## Содержание
<!-- TOC depthFrom:2 -->

- [Содержание](#содержание)
- [Настройка серверной части](#настройка-серверной-части)
    - [Общая информация о серверной части](#общая-информация-о-серверной-части)
    - [Конфигурирование и запуск сервера](#конфигурирование-и-запуск-сервера)
- [Настройка клиентской части](#настройка-клиентской-части)
    - [Общая информация о клиентской части](#общая-информация-о-клиентской-части)
    - [Конфигурирование и запуск клиента](#конфигурирование-и-запуск-клиента)
    
    

<!-- /TOC -->

## Настройка серверной части
### Общая информация о серверной части
Серверная часть написана на фреймворке django (python). 
В проекте реализована авторизация через Active Directory, 
доступ к каждой странице и права редактирования осуществляется через профиль пользователей, 
который возможно настроить вручную или автоматически через контроллер домена.


### Конфигурирование и запуск сервера
Для запуска сервера следует выполнить следующие шаги:
1. В файле settings.py прописать доступы к базе данных
2. Указать хост клиента для CORS политики (требуется при режиме отладки клиентской части) 
3. При использовании Active Directory указать доменные группы для прав администратора, 
для доступа на сайт используется функция views.user_profile
4. Создать суперпользователя для доступа к панели администратора
    
       python3 manage.py createsuperuser

5. Для запуска сервера необходимо вызвать команду:

        python3 manage.py runserver
[К содержанию](#содержание)
***

## Настройка клиентской части
### Общая информация о клиентской части
Клиентская часть написана с применением библиотке React. 

### Конфигурирование и запуск клиента
Клиентская часть может быть запущена в 2 режимах: разработки и работы.
>Для режима разработки выполнить команду `npm run start`. 
В файле core.workWithServer указать домен сервера.

>Для режима работы выполнить команду `npm run build`. 
Шаблонизатор django настроен на путь до файлов сборки.

[К содержанию](#содержание)
***