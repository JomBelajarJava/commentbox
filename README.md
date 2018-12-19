# commentbox

Projek demo untuk aplikasi comment box menggunakan Spring Boot

## Setup

### Database

Aplikasi ini menggunakan Google Datastore, jadi kita memerlukan emulator untuk database tersebut.

Install emulator:
```
gcloud components install cloud-datastore-emulator
```

Run emulator:
```
gcloud beta emulators datastore start
```

### Asset

Aplikasi ini mengandungi file JavaScript yang dipecahkan kepada beberapa file.
Untuk compile file-file tersebut, pergi ke folder `src/main/javascript`:
```
cd src/main/javascript
```

Kemudian jalankan script `make`:
```
./make --profile=dev
```

## Development

Gunakan command Maven untuk menjalankan aplikasi,
```
./mvnw spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=development'
```

Kalau anda ada menggunakan GNU Screen, anda boleh menggunakan file config `screenrc`:
```
screen -c screenc
```

Anda boleh lihat file tersebut dan tweak mana-mana yang patut.

## Deployment
```
./mvnw clean appengine:deploy
```
