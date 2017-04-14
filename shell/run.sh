echo "Welcome $USER to JOTPOT OS!"
if [ "$jposgui" == "yes" ]
then
	cd /JPOS
	startx "$jposguirun"
	cd ~
fi
