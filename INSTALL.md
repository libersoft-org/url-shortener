# URL Shortener - installation

These are the installation instructions for **Debian Linux** (logged in as root):

## 1. Run the following commands to download and create a settings file:

```bash
apt update
apt -y upgrade
apt -y install curl unzip git mariadb-server mariadb-client
curl -fsSL https://bun.sh/install | bash
source /root/.bashrc
git clone https://github.com/libersoft-org/url-shortener.git
cd url-shortener/src/
bun i
./start.sh --create-settings
```

## 2. Edit the "settings.json" file and set the following:
- **web** section
  - **name** - the name of your website (in document title)
  - **standalone** - true / false
    - **true** means it will run a standalone web server with network port
    - **false** means you'll run it as a unix socket and connect it through other web server (**Nginx** is recommended)
  - **port** - your web server's network port (ignored if you're not running a standalone server)
  - **socket_path** - path to a unix socket file (ignored if you're running standalone server)
- **database** section - the hostname, port, name, user and password to your MariaDB database
- **other** section
  - **log_to_file** - if you'd like to log to console and log file (true) or to console only (false)
  - **log_file** - the path to your log file (ignored if log_to_file is false)

## 3. Set the NGINX site host config file

The following applies only for unix socket server. Skip this step if you're running standalone server.

If you don't have your Nginx web server installed, run this command:

```bash
apt install nginx
```

In **/etc/nginx/sites-available/**, create the new config file named by your domain name, ending with ".conf" extension (e.g.: your-server.com.conf).

For example:

```bash
nano /etc/nginx/sites-available/your-server.com.conf
```

The example of NGINX site host config file:

```conf
server {
 listen 80;
 listen [::]:80;
 server_name your-server.com *.your-server.com;

 location / {
  proxy_pass http://shortener;
 }
}

upstream shortener {
 server unix:/run/shortener.sock;
}
```

Now enable the site:

```bash
ln -s /etc/nginx/sites-available/your-server.com.conf /etc/nginx/sites-enabled/your-server.com.conf
```

Then restart the NGINX server:

```bash
service nginx restart
```

You can also add the HTTPS certificate using **certbot** if needed.

## 4. Create the MariaDB user and grant privileges to your database

```bash
mysql -u root -p
```

... after you log in set the database root password or create a new database user and grant it's privileges:

a) for **root**:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'some_password';
```

b) for **other user**:

```sql
CREATE USER 'some_user'@'localhost' IDENTIFIED BY 'some_password';
GRANT ALL ON some_database.* TO 'some_user'@'localhost';
```

... after that exit the database simply by "**exit**" command.

## 5. Create the database

```bash
./start.sh --create-database
```

## 6. Start the server application

a) to start the server in **console** using **bun**:

```bash
./start.sh
```

b) to start the server in **console** by **bun** in **hot reload** (dev) mode:

```bash
./start-hot.sh
```

c) to start the server in **screen** by **bun**:

```bash
./start-screen.sh
```

d) to start the server in **screen** by **bun** in **hot reload** (dev) mode:

```bash
./start-hot-screen.sh
```

## 7. Open your web server address in your web broswer

- For example: **https://your-server.com/**
