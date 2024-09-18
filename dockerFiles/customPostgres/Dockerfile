FROM postgres:bullseye

COPY createAccounts1.sh /docker-entrypoint-initdb.d/
COPY migrationScript2.sql /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/createAccounts1.sh