import urllib2
import json
import time
import sys

class Tumblr( object ):

    def __init__( self, api_key ):
        self.api_key = api_key
        self.info_base_url = "http://api.tumblr.com/v2/blog/barmitzvahjams.tumblr.com/info"
        self.posts_base_url = "http://api.tumblr.com/v2/blog/barmitzvahjams.tumblr.com/posts"
        self.site_info = dict()
        self.num_posts = 0

    def load_info( self ):
        url = self.info_base_url + "?api_key=%s" % self.api_key
        response = urllib2.urlopen(url)
        self.site_info = json.loads( response.read() )

    def get_posts( self, start, num ):
        url = self.posts_base_url + "?offset=%s&limit=%s&api_key=%s" % (start, num, self.api_key)
        response = urllib2.urlopen(url)
        return json.loads( response.read() )

    def build_playlist( self, urls ):
        all_videos = "var all_videos = ["
        for url in urls:
            url.replace( "\n", "" )
            url = url.strip()
            if url != '':
                all_videos += "'"+url[url.find( "?v=" )+3:]+"',"

        all_videos = all_videos[:-1] + "];"

        return all_videos

if len( sys.argv ) > 1:
    t = Tumblr( sys.argv[1] )
    t.load_info()

    if t.site_info and "response" in t.site_info:
        t.num_posts = t.site_info["response"]["blog"]["posts"]
        q = t.num_posts / 20
        r = t.num_posts % 20

        errors = 0
        vids = list()
        for n in range( 0, q ):
            posts = t.get_posts( n*20, 19 )
            for post in posts["response"]["posts"]:
                if "permalink_url" in post:
                    vids.append( post["permalink_url"] )
                    #print post["permalink_url"]
                else:
                    errors += 1
            time.sleep( 1 )

        time.sleep( 1 )

        posts = t.get_posts( t.num_posts-r, r )
        for post in posts["response"]["posts"]:
            if "permalink_url" in post:
                vids.append( post["permalink_url"] )
                #print post["permalink_url"]
            else:
                errors += 1

        print errors

        print t.build_playlist( vids )