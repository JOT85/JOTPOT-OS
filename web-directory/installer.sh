#!/bin/bash
clear
echo "Welcome to the JOTPOT OS (JPOS) installer..."
if [ "$(whoami)" != "root" ]
then
	echo "The installer should be run as root. To run as root, either be logged in as root or put 'sudo' in front of the command to start the installation."
	exit
fi
echo "JOTPOT OS is a very experomental OS with it's GUI based on electron and is designed to be increadably open to modification. This is somthing that has never been done before and this is being developed mainly as a very eirly test for what is to come."
echo "Because of this it can be unstable. It should not have massive problems however small issues are very likely to occur, and larger ones may happen."
echo "JPOS is licenced under the Apache License 2.0 - view at http://www.apache.org/licenses/LICENSE-2.0"
echo "NONE OF YOUR FILES SHOULD BE LOST during this installation, however it is still highly recomended you make backups of all files on this computer before installing."
echo ""
echo "!!! Please do not power off this computer while JPOS is installing, this may lead to data curruption or an incomplete installation, thus leaving your computer in an unstable state. !!!"
echo ""
conf=""
echo "Start installation of JPOS now? [Y/n]"
while [ "$conf" != "y" ] && [ "$conf" != "Y" ]
do
read -s -n 1 conf
if [ "$conf" == "n" ] || [ "$conf" == "N" ]
then
	exit
fi
done
echo "OK, starting JPOS installation now..."
a="$(arch)"
if [ "$a" == "x86_64" ]
then
	a="x64"
elif [ "$a" == "x86" ]
then
	a="ia32"
fi
electron_version="1.6.2"
echo "Downloading precompiled version of electron v$electron_version for linux on $a from 'https://github.com/electron/electron/releases/download/v$electron_version/$electron_file.zip'..."
electron_file="electron-v$electron_version-linux-$a"
wget -O "electron.zip" "https://github.com/electron/electron/releases/download/v$electron_version/$electron_file.zip" >/dev/null
echo "Extracting electron..."
unzip "electron.zip" -d "installer" >/dev/null
mv ./installer/electron ./installer/installer
rm ./installer/resources/default_app.asar
echo "Downloading JPOS installer scripts..."
wget -O "./installer/resources/app.asar" "https://www.jotpot.co.uk/experimental/JPOS/installer.asar" >/dev/null
echo "Installing/Updating the X server..."
apt-get -y install xinit >/dev/null
echo "Changing boot target..."
mv /etc/rc.local /etc/rc.local.old
echo "#!/bin/bash" >/etc/rc.local
echo "exec < /dev/tty1" >>/etc/rc.local
echo "exec 1 >/dev/tty1" >>/etc/rc.local
echo "exec 2 >/dev/tty1" >>/etc/rc.local
echo "cd /JPOS-install" >>/etc/rc.local
echo "startx /JPOS-install/installer/installer >/dev/null" >>/etc/rc.local
echo "exit 0" >>/etc/rc.local
systemctl set-default -f multi-user.target >/dev/null
echo "Rebooting..."
reboot
exit 0