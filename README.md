Muebleria George
=================

## Local network setup

The backend relies on the `SERVER_IP` value defined in `Backend/.env` to
configure `ALLOWED_HOSTS` and CORS. Update this variable with your machine's
local IP so other devices on the network can reach the API:

```
SERVER_IP=192.168.1.51
```

Start the backend with:

```
python manage.py runserver 192.168.1.51:8000
```

The frontend automatically uses the current hostname to contact the backend on
port `8000`. Launch it with:

```
npm run dev
```
