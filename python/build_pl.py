fd = open( "videos.json" )
content = fd.readline()
all_videos = "var all_videos = ["
while (content != "" ):
    content.replace( "\n", "" )
    content = fd.readline()
    content = content.strip()
    if content != '':
    	all_videos += "'"+content[content.find( "?v=" )+3:]+"',"

all_videos = all_videos[:-1] + "]"

print all_videos