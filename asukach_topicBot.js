/* asukach_topicSplit
author ustreamer-01647
latest update 2012年1月26日19時16分
*/

/* 用語
ストリーム: stream．(ust|jus)[12]各個のチャンネルのこと
タイトル: title．各ストリームのトピックタイトルのこと

 * asuka ch topic pattern
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

 * トピックボット機能
	初期化
	対決設定と解除
	大会設定と解除
	ストリーム使用宣言，タイトル設定，使用解除

if(ユースト1「」$/)||ユースト1｢｣$/)||ust1「」$/)||ust1｢｣$/)||ustream1「」$/)
||ustream1｢｣$/)||ユーストリーム1「」$/)||ユーストリーム1｢｣$/)||ユースト１「」$/)|
|ユースト１｢｣$/)||ust１「」$/)||ust１｢｣$/)||ustream１「」$/)||ustream１｢｣$/)|
|ユーストリーム１「」$/)||ユーストリーム１｢｣$/)){

if(ジャスティン1「」$/)||ジャスティン1｢｣$/)||jus1「」$/)||jus1｢｣$/)||justin1「」$/)|
|justin1｢｣$/)||ジャス1「」$/)||ジャス1｢｣$/)||ジャスティン１「」$/)||ジャスティン１｢｣$/)
||jus１「」$/)||jus１｢｣$/)||justin１「」$/)||justin１｢｣$/)||ジャス１「」$/)||ジャス１｢｣$/)){

*/

// setting
var TargetChannel = "#paulga";
var ReserveText = "準備中";

// 正規表現
var titleBracketOpen = "[「｢]";
var titleBracketClose = "[」｣]";
var u1stringPattern = "(ユースト(リーム)?)|(ust(ream)?)[1１]";

// global vars
var channelTopic;
var streams;
var taiketu;
var taikai;

/** ストリーム情報クラス
 @param name ストリーム名称
 this.status 未設定0，準備中1，使用中2
*/
function stream( name )
{
	this.name = name; // Ust01やJus02などの，区別と表記に用いる文字列
	this.status = 0; // 未設定0，準備中1，使用中2
	this.title = ""; // 使用中ならば，なんらかの文字列が格納される
	
	// this.status 値によって変わる
	this.toString = function()
	{
		switch( this.status )
		{
		case 1:
			// 準備中
			return this.name + ReserveText;
		case 2:
			// タイトル表示
			return this.name + "「" + this.title + "」";
		case 0:
		default:
			// 空文字列
			return "";
		}
	}
}

function initialize()
{
	channelTopic = "";
	taiketu = "";
	streams = new Array( new stream("Ust01"), new stream("Jus01"), new stream("Ust02"), new stream("Jus02") );
	taikai = "";
	//taikai = " http://bit.ly/asuka_ch";
}

function parseTopic ( topic )
{
	endBracket = 0; // 文字列検索始点ポインタ
	// 対決判定
	if ( 0 <= channelTopic.search( /^対決「/ ) )
	{
		// 対決中
		endBracket = channelTopic.search( /」/ );
		taiketu = channelTopic.substring( "対決「".length, endBracket );
		// 通常運行時に合わせるため，さらに 1 加算する
		endBracket += "」".length + 1;
	}else
	{
		// 通常運行
		for ( i in streams )
		{
			// 接頭辞（Ust01だのJus02だの）を探す
			regExp = new RegExp ( "^" + streams[i].name );
			result = channelTopic.substring(endBracket).search( regExp );
			if ( -1 == result )
			{
				continue;
			}
			else
			{
				// 準備中か否か
				regExp = new RegExp ( "^" + ReserveText );
				result = channelTopic.substring( endBracket + streams[i].name.length ).search ( regExp );
				if ( 0 == result )
				{
					// 準備中
					streams[i].status = 1;
					endBracket += streams[i].name.length + ReserveText.length + 1;
				}else
				{
					// 使用中
					streams[i].status = 2;
					titleStart = endBracket + streams[i].name.length + "「".length;
					streams[i].topic = channelTopic.substr (
						titleStart,
						channelTopic.substring ( titleStart ).search("」")
					);
					// stream間は半角スペースを挿入しているため，さらに 1 加算する
					endBracket += streams[i].toString().length + 1;
				}
			}
		}
	}
	// 大会欄
	// 最後の閉じ括弧が 0 から変化しているとき，1 減算する
	if ( 0 != endBracket )
		endBracket -= 1;
	taikai = channelTopic.substring( endBracket );
	print(true);
}

// デバッグ用表示
function print( Notice )
{
	if ( Notice )
	{
		send( TargetChannel, "topic: " + channelTopic );
		send( TargetChannel, "taiketu: " + taiketu );
		for ( i in streams )
		{
			send( TargetChannel, streams[i].toString());
		}
		send( TargetChannel, "taikai: " + taikai );
	}else
	{
		log( "topic: " + channelTopic );
		log( "taiketu: " + taiketu );
		for ( s in streams )
		{
			log( s );
		}
		log( "taikai: " + taikai );
	}
}

function event::onChannelText(prefix, channel, text)
{
	if ( channel != TargetChannel )
		return;
	if ( prefix.nick != "paulga" )
		return;

	parseCommand ( text );

//	if ( text == "chk" )
	//	topic( TargetChannel );
}

function parseCommand ( text )
{
	re = new RegExp ( "^" + u1stringPattern + titleBracketOpen + titleBracketClose + "$" );
	send ( TargetChannel, re.exec(text) );
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
	keyword = new RegExp ( "^" + TargetChannel + " " );
	if ( null ==  msg.match( keyword ) )
		return;
	
	// 変数初期化
	initialize();
	// トピック抽出
	channelTopic = msg.substring ( (TargetChannel + " ").length );
	// トピック解析
	parseTopic ( channelTopic );

}


