/* asukach_topicSplit
author ustreamer-01647
latest update 2012年1月26日19時16分
*/

/* asuka ch topic perttern
通常状態または対決状態
	対決状態ならば先頭が 対決「
各chヘッダを探す
	現時点標準形式（2012年1月26日）
	Ust01準備中 bit.ly/asuka_ch 17:24 Ust01「まんぽヾ(◔ ⊱ ◔｀)ﾉ゛」 bit.ly/asuka_ch
	http://ujsutsrteianm.web.fc2.com/asuka_ch/asuka-ch-ver4.js
		(Ust0|Jus0)[12]
	現時点sum_el形式（2012年1月26日）には対応しない
	J1準備中 bit.ly/asuka_ch  J1「ガチンコ万歩計」 bit.ly/asuka_ch
		[UJ][12]
大会欄未設定か否か
	大会欄未設定なら末尾が http://bit.ly/asuka_ch
	設定時，大会欄文字列抽出は後回し
*/

// setting
var targetChannel = "#paulga";

// global vars
var channelTopic;
var taiketu;
var u1;
var j1;
var u2;
var j2;
var taikai;

function event::onLoad()
{
	initialize();
}

function initialize()
{
	channelTopic = "";
	taiketu = "";
	u1 = "";
	j1 = "";
	u2 = "";
	j2 = "";
	taikai = "http://bit.ly/asuka_ch";
}

function asukach_topicSplit ( topic )
{
	endBracket = 0;
	// 対決判定
	if ( 0 <= channelTopic.search( /^対決「/ ) )
	{
		// 対決中
		endBracket = channelTopic.search( /」/ );
		taiketu = channelTopic.substring( "対決「".length, endBracket );
		log(endBracket);
	}else
	{
		// 通常運行
		Head = new Array("Ust0", "Jus0");
		Num = new Array("1", "2");
		Ready = "準備中";
		startBracketChar = "「";
	}
	// 大会欄
	if ( 0 < endBracket )
		endBracket += 2;
	if ( null == channelTopic.substring( endBracket ).match( taikai ) )
		taikai = channelTopic.substring( endBracket );
	log(endBracket);
	loglog();
}

function loglog()
{
	log( "topic: " + channelTopic );
	log( "taiketu: " + taiketu );
	log( "u1: " + u1 );
	log( "j1: " + j1 );
	log( "u2: " + u2 );
	log( "j2: " + j2 );
	log( "taikai: " + taikai );
}

function event::onChannelText(prefix, channel, text)
{
	if ( channel != "#paulga" )
		return;
	if ( prefix.nick != "paulga" )
		return;

	if ( text == "chk" )
		topic( targetChannel );
}

// 現在のトピックを取得する
function event::onNumericReply( number, msg )
{
	/*
	http://jbpe.tripod.com/rfcj/rfc2812.j.sjis.txt
	     332 RPL_TOPIC
          "<channel> :<topic>"
          - チャンネルトピックを決めるのにTOPICメッセージを送ったとき、二つ
          のうちどちらかのリプライが送られます。トピックが設定されれば
          RPL_TOPICが返送され、設定されなければRPL_NOTOPICが返ります。
	*/
	if ( 332 != number )
		return;
	keyword = new RegExp ( "^" + targetChannel + " " );
	if ( null ==  msg.match( keyword ) )
		return;
	
	channelTopic = msg.substring ( (targetChannel + " ").length );
	asukach_topicSplit ( channelTopic );

}

