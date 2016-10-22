#!/usr/bin/env python
#coding=utf-8

import re
import os
import time
import json
import thread
import pycurl
import urllib
import threading
import StringIO
import MySQLdb

KEY = '1d2e1ae593f0bc92aec78963335234ec'

def CurlPOST(url, data, cookie):
	c = pycurl.Curl()
	b = StringIO.StringIO()
	c.setopt(pycurl.URL, url)
	c.setopt(pycurl.POST, 1)
	c.setopt(pycurl.HTTPHEADER,['Content-Type: application/json'])
	# c.setopt(pycurl.TIMEOUT, 10)
	c.setopt(pycurl.WRITEFUNCTION, b.write)
	c.setopt(pycurl.COOKIEFILE, cookie)
	c.setopt(pycurl.COOKIEJAR, cookie)
	c.setopt(pycurl.POSTFIELDS, data)
	c.perform()
	html = b.getvalue()
	b.close()
	c.close()
	return html
	
def CurlGET(url, cookie):
	c = pycurl.Curl()
	b = StringIO.StringIO()
	c.setopt(pycurl.URL, url)
	# c.setopt(pycurl.TIMEOUT, 10)
	# c.setopt(pycurl.POST, 1)
	c.setopt(pycurl.WRITEFUNCTION, b.write)
	c.setopt(pycurl.COOKIEFILE, cookie)
	c.setopt(pycurl.COOKIEJAR, cookie)
	c.perform()
	html = b.getvalue()
	b.close()
	c.close()
	return html

def SendAndRecv(uin, msg):
    try:
        ret = CurlPOST('http://www.tuling123.com/openapi/api', json.dumps({
            'key' : KEY,
            'info' : msg,
            'userid' : uin
        }), './public/cookie_useless')
        return json.loads(ret)
    except Exception,e:
        print str(e)
        return {'text' : 'error'}

# print SendAndRecv('asdas', '你是')
