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
function file {
	if [ -f "$1" ] || [ -d "$1" ]
	then
		echo "'$1' already exists, renaming it to $1.old"
		sleep 2
		file "$1.old"
		mv "$1" "$1.old"
	fi
}
file "/server"
file "/JPOS"
electron_version="1.6.2"
electron_file="electron-v$electron_version-linux-$a"
echo ""
echo "Downloading precompiled version of electron v$electron_version for linux on $a from 'https://github.com/electron/electron/releases/download/v$electron_version/$electron_file.zip'..."
wget -O "electron.zip" "https://github.com/electron/electron/releases/download/v$electron_version/$electron_file.zip" >/dev/null 2>/dev/null
echo "Extracting electron..."
unzip -o "electron.zip" -d "installer" >/dev/null
mv ./installer/electron ./installer/installer
rm ./installer/resources/default_app.asar
echo ""
echo "Downloading JPOS installer scripts from 'https://www.jotpot.co.uk/experimental/JPOS/installer.asar'..."
wget -O "./installer/resources/app.asar" "https://www.jotpot.co.uk/experimental/JPOS/installer.asar" >/dev/null 2>/dev/null
echo ""
echo "Installing/Updating the X server..."
echo "    This will either be really quick or take a VERY long time depending on the state of your system..."
echo "    This process is very unlikely to hang, please give it time..."
echo "Package 1/3 - 'xorg'"
apt-get -y install xorg >/dev/null 2>/dev/null
echo "Package 2/3 - 'openbox'"
apt-get -y install openbox >/dev/null 2>/dev/null
echo "Package 3/3 - 'xinit'"
apt-get -y install xinit >/dev/null 2>/dev/null
echo "Installing/Updating required libraries."
echo "Library 1/3 - 'libxss1'"
apt-get -y install libxss1 >/dev/null 2>/dev/null
echo "Library 2/3 - 'libnss3'"
apt-get -y install libnss3 >/dev/null 2>/dev/null
echo "Library 3/3 - 'libgconfmm-2.6-1c2'"
apt-get -y install libgconfmm-2.6-1c2 >/dev/null 2>/dev/null
echo ""
echo "Changing boot target..."
file /etc/rc.local
echo "#!/bin/bash" >/etc/rc.local
echo "exec < /dev/tty1" >>/etc/rc.local
echo "exec >/dev/tty1" >>/etc/rc.local
echo "cd /JPOS-install" >>/etc/rc.local
echo "startx /JPOS-install/installer/installer >/dev/null" >>/etc/rc.local
echo "exit 0" >>/etc/rc.local
chmod +x /etc/rc.local
systemctl set-default -f multi-user.target >/dev/null
echo "Ready."
echo "Rebooting in 5 seconds..."
sleep 5
reboot
exit 0