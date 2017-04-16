#!/bin/bash
echo "New version coming out soon..."
if [ "$1" == "gnome" ]
then
	startx /usr/bin/gnome-session
else
	cd /JPOS
	startx /JPOS/JPOS
fi
