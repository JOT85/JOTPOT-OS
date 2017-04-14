echo "Welcome $USER to JOTPOT OS!"
PATH="$PATH:/JPOS"
export PATH
if [ "$jposgui" == "yes" ]
then
	cd /JPOS
	startx "$jposguirun"
	cd ~
fi
