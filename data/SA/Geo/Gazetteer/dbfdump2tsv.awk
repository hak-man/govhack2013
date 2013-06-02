#!/usr/bin/gawk -f

#  1 OBJECTID
#  2 RECNO
#  3 NAME
#  4 F_CODE
#  5 OTHERDETLS
#  6 SOURCE
#  7 CLASS
#  8 COUNTY
#  9 LATITUDE
# 10 LONGITUDE
# 11 STATE
# 12 NAMEDBY
# 13 DATENAMED
# 14 DERIVATION
# 15 ORIGCODE
# 16 CURNAME
# 17 PREVNAME
# 18 ALTNAME
# 19 ELEVATION
# 20 PUBLIC_REL


BEGIN {
#                    1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20
    FIELDWIDTHS = " 10  10 120  35 256 257  26  25  18  17   6  30  11  41   9  41  41  41  10  11";
    OFS="	";
#    OFS="||";
}

{
    $1=$1;
    for (i=1 ; i<=20; i++) {
        gsub( /^\s+/, "", $i);
        gsub( /\s+$/, "", $i);
    }
    print $0;
}
