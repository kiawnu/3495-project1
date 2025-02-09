services:
    db:
        image: mysql
        environment: 
            MYSQL_RANDOM_ROOT_PASSWORD: 1
            MYSQL_USER: user 
            MYSQL_PASSWORD: acit
            MYSQL_DATABASE: projectdb
        ports:
            - 3306:3306
        volumes: 
            - ACIT3495-storage:/var/lib/mysql
volumes:
    ACIT3495-storage: 