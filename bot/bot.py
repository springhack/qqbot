#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import qqbot
import tuling

def showImage(filename):
    print 'Path:', filename

qqbot.showImage = showImage
qqbot.TmpDir = './public/tokens'
if not os.path.exists(qqbot.TmpDir):
    os.mkdir(qqbot.TmpDir)


class MyQQBot(qqbot.QQBot):
    def __init__(self, token):
        self.token = token

    def onPollComplete(self, msgType, from_uin, buddy_uin, message):
        if msgType == 'discuss' or msgType == 'buddy':
            ret = tuling.SendAndRecv(from_uin, message)
            mmm = ret['text']
            if 'url' in ret:
                mmm = mmm + '\n' + ret['url']
            if 'list' in ret:
                mmm = mmm + '\n' + json.dumps(ret['list'])
            self.send(msgType, from_uin, mmm, u'宝宝我')


myqqbot = MyQQBot('asdasd')
myqqbot.Login()
myqqbot.PollForever()
