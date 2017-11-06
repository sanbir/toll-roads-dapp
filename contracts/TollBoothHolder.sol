pragma solidity ^0.4.13;

import "./interfaces/TollBoothHolderI.sol";
import "./Owned.sol";

contract TollBoothHolder is TollBoothHolderI, Owned {

    mapping (address => bool) tollBooths;

    /**
     * Called by the owner of the TollBoothOperator.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the argument is already a toll booth.
     *     It should roll back if the argument is a 0x address.
     *     When part of TollBoothOperatorI, it should be possible to add toll booths even when
     *       the contract is paused.
     * @param tollBooth The address of the toll booth being added.
     * @return Whether the action was successful.
     * Emits LogTollBoothAdded
     */
    function addTollBooth(address tollBooth)
        fromOwner()
        notZeroAddress(tollBooth)
        whenNotTollBooth(tollBooth)
        public
        returns(bool success) {

        tollBooths[tollBooth] = true;
        LogTollBoothAdded(msg.sender, tollBooth);
        return true;
    }

    /**
     * @param tollBooth The address of the toll booth we enquire about.
     * @return Whether the toll booth is indeed part of the operator.
     */
    function isTollBooth(address tollBooth)
        constant
        public
        returns(bool isIndeed) {

        return tollBooths[tollBooth];
    }

    /**
     * Called by the owner of the TollBoothOperator.
     *     It should roll back if the caller is not the owner of the contract.
     *     It should roll back if the argument has already been removed.
     *     It should roll back if the argument is a 0x address.
     *     When part of TollBoothOperatorI, it should be possible to remove toll booth even when
     *       the contract is paused.
     * @param tollBooth The toll booth to remove.
     * @return Whether the action was successful.
     * Emits LogTollBoothRemoved
     */
    function removeTollBooth(address tollBooth)
        fromOwner()
        notZeroAddress(tollBooth)
        whenTollBooth(tollBooth)
        public
        returns(bool success) {

        tollBooths[tollBooth] = false;
        LogTollBoothRemoved(msg.sender, tollBooth);
        return true;
    }

    modifier whenTollBooth(address tollBooth) {
        require(isTollBooth(tollBooth));
        _;
    }

    modifier whenNotTollBooth(address tollBooth) {
        require(!isTollBooth(tollBooth));
        _;
    }

    /*
     * You need to create:
     *
     * - a contract named `TollBoothHolder` that:
     *     - is `OwnedI`, `TollBoothHolderI`.
     *     - has a constructor that takes no parameter.
     */         
}
                   //                           HODOR
                   //                                                 ``  ``     ``  `                                                                   
                   //                                         `          ````          ``                                                                
                   //                                        ````       `.```..` ` ```` ````                                                             
                   //                                      `..```` ``.`  ``,`````````.``                                                                 
                   //                                   ``.,,:,,,`  `,.,.,.,....,...`````            ```                                                 
                   //                            ```````...,.,,,;:,:;,,,,,,,,,..`,::,` `` `````    `..``                                                 
                   //                         ```.`.`.``..:;;i;;i*#+*i;;::**+++;:.,,,::,.```.``   `` ```                                                 
                   //                         `.`..:,,..,;*+**+*izz#***##i++*;*+*;.:i::::,,,,`..`  ``````                                                
                   //                        ....;ii:,,:i*##+##iiiii*###+++**;i#+*::;+*i.....:,.,,.``  ` ` ..``                                          
                   //                    ```.:..,i*i::;;++zz#+++++#znzz#++++*ii*+*i;;*+*;:,,...,.:;:,,,.``,:```.`                                        
                   //                    ``.:,,::;i:;;i*+nzznnnxxMxnnzz##+#++ii**+**i;***:i;;,.``.,:;;;:;;,,.`..`                                        
                   //               ` ```..,,,,,:i*;i**+zxMMMMMMxxnz##++++*+++**iiiii;;i*i**iiii,``:::;ii;:,,``                                          
                   //              ..``..,,,,,,::i##+**+nxnnnnnnz#++++++**+++##+++****iii*;iiiii:,..,,:i*;;:,`                                           
                   //             .,,...,:::,,,ii;#xn#*#znz++**#*i*i******++#####zzzzz#*iiiiiiii*ii;,.``:i:,,`                                           
                   //            `,:..,,:;:,:i;*n#*#zz+#zz#++**+****i*********++#####+**iii;iii;;;;i*;.;,,:,.``                                          
                   //            .:,::;;i:,i*iizzxnnz###n+iii****iiiii***i**i*iiiiiiiiii;;;;;::;::::,..`,.::::.`                                         
                   //           ,,,:;;ii:,,;+*iznnxz++#z+*i**iiiiiiiiiiiiiiiiiiiiiiiiii;;;;;::::::,..``  `.,,;:.`                                        
                   //           `,;;;;;::;;i#+i#xnz+**z+*iiiiiiiiii**iiiiiiiiiiiiiiiiiii;;;;;::,,,..`.``   `:ii;;,`                                      
                   //           `,,::::;;*i*###+znz++##**iiiiiiiiiiiiiiiiiii;;;;;i;iiiii;;;;:::,...` ```    `;i:,;,                                      
                   //           `:,iiiii;*i*+#nnzz#+#+**iiiiiiiiiiiiiiiiiii;;;;;;;;;;;;;;;;;;:,,.```   ````  `i;,`:`                                     
                   //           `:;;i;;i*i*+++zxxz#z+**iiii**iiiiiiiiiiiii;;;:::;;;;;;i;;;;;;;:,..`` ``````  `;**,,:                                     
                   //          ``,;i*ii*i*++z#znn#+*+#+iiiii*ii*iiiiiiiiiiii;;;;::::;;;i;i;;;;;;::,,...```  ``:#+;,;``                                   
                   //           .,:i;*+*i*#*#xnxnz+*+*#**iii*i*iiiiiiiiiiiiiii;;;;;::;;i;;i;;i;;;::::.,..``   ;z+;:;`                                    
                   //          `.:;:i**#*i#++zxxnz#+**++*iiiiiiiiiiii**iiiiiiiii;;;:;;;;;iiiiiiii;;;i:,,.`    :n#i;:                                     
                   //          `::;:;;i+i**##znxxn##+**+*i;iiiiiii**ii*****i**iiiiii;;ii;iiii***ii;;;;:,..`   .z++:.                                     
                   //         `.:;;:i*##z#zzz#znMxz#++**+++*+******iii**************iii**********iii;;:,,.`   `***,`                                     
                   //         `,;i;;;*+#zznxnnnnxxz+**i**i**+**+**+++*++++*+++++++++++++++++++++++*****i;:,.`  ;:,,.                                     
                   //          ,:i;i**+++#znMMMxxxn++*++iii*++zzz#zz#zznnnnnzz#zz###zzz####zz##zzznnnnnnn#+i,``.,`,.`                                    
                   //         `,;;*i+#*nzznnnnnMxnn###+*i*+#zzznnnnnnxxMW@@WWWMxxnnnnnzzzznnnxxMMMMMxxnz#+++;```;`..`                                    
                   //          :;*++zz#zzzxxxnnxxnn###+***+#zz###zzzzzznxMMWWWWWMxMxn##++#nxMMWWWWWMMxxnz#+*i.``,.`                                      
                   //          :i**#nnnnMnxxxnxxxn#**+*i**+++#+###znxMMWWWWW@@@@Wxnz+i;;::+xWWWWMxM@@@@@WWx#i:` .,`                                      
                   //          ,*i*##znnxzxnnxxxxz+i*+iii*+###znMW@@WxW@@WWMWWxMMzz#*i;;::;#xxxMxnnxxzz#+#n#*;` .,.                                      
                   //          `;*i+#nnznznnzznnn#+***iiii+znxMWMMMxnnznnnnxxxnxz++++i;;:,,i+nnnnnzzz##++;:,,.` .,,                                      
                   //           .;**+nzz+#z#znnnn#*****iiii*++###zzzzzznnnnnz###+++**ii;:,.:;i*++++#++*i;:,``   ,*.                                      
                   //           .,i**zz#**+zznxxnzz#**iiiiiiii*i**++######+++++++***iii;:,`.,:;;iii;ii;::..``   ,*`                                      
                   //          `.,;i*zz#ii*zn#nxnnn#**iii;;;ii;;;;iiii***************iii;:.`.:;;;;;;;::,,...````.;``                                     
                   //         `..,:ii##*i*znMznnMnx#**iiiiii;;;;::::;;;iiiiiii*##+*i*i*i;;,.`:++*ii;;;:,.````````,:;.`                                   
                   //         `.,::;ii+*;+zxx#*+xnx#*iiii*iiii;;;;::;;:;;;ii*#nz+**iiii;;;:,.`:+#+*ii;::,.``  `` `:+;,`                                  
                   //        `...:+n#ii*;i#nz*i*znx#*iiiiiiii;;;;::;;;;;;;i*#nx#iiii**iiiiii:...+z#**ii;;:,.`    `.zx+,```                               
                   //        `::,;*+nn;**;+#z#*+zxx#***iiiiiii;;;;;::;;;ii*#nxx#i+#nnz#+++##+i+**nz+***i;;:,.`   `.+nn+;:..`                             
                   //         ``:;i++x+i**i;i+#+#zzz#*iiiiiiiii;;;;;:;;ii*#nxnnzznW@@MxnnxxznMx##zzz#+**i;;::.`   `#MMnnz*:.,`                           
                   //           .,::;+xi;ii;ii;+####+*iiii;;ii;;;;;;iii*++#nn##zxxxxxxxxMxn#nx#***+znz#++*ii:,``  `;xxxnn*;;,..                          
                   //             `.izMn;i;;i:i*+*+#+*iiii;iiiii;;iiiii*++zz+++#znnnnnxxzn#+##*ii*i*#nzz+*ii;:,`` `.xMMWxn++i:..`                        
                   //            `.ixxMMz;:::**i*i*+++iiiiiiiiiiiiiiiiii**++**+#*+#nzznnnz#*+*iii***++zz#+*ii;:.````zWMxxMz+ii:...`                      
                   //           `.+xnMMWW#,:i+**i*++#+*ii*iiiiiiiiiiiii*******+++#z#zzz#nz#****ii**+++#zz++*i;,,````*xMxxMxnzi::.```                     
                   //          .:*nnWxxW@M***z#ii*+***++**iii;iiiiiiiiiii**++##zzzz##+*ii*iiiii**++##**+#+*i;:,,`` `*xxxMMxz#+;;:,.``                    
                   //         .:inzxzxW@##Wxx#**i+***+++***iiiiiiiiiiiii*+++zznnz++**+###+++++***+++#+*+#*;i;::,.```*nzxMMMxz++;::,.``                   
                   //       `,:*##nzzMW@@#@@@#ii****++++***ii*iiiiiiiiii###+#z##+#znnnzz#+++***zxxnz#++##*;:;::,.` `+zznMMMMMn++::,...`                  
                   //      `,*++#xn#xMW@@##@#z*iii*++*+*+**iiiiiiiii;;i#+*#+##zxxxz#+*i;;:::,,,,,:i+++++*i;:::,:.` `+x##znxxxMx*i;:,...`                 
                   //    `:,+##zMMnzM@@@@####niiiii***+*++**ii**iii;;i*+###+++**iiiii;;;:::::,,...,:i*i**;;:,:;,,``.xMz+*###znxx#i;;,,,,                 
                   //   `:;###zxMx#nW@@@#####x*iiii**i+*+********iiiii*#zz**i;;;;:::;;;;;iiii;:,....,:;i+*i;:::,,``izxWMWn#*##nxn+;:;,::.                
                   //   :*+x+#xMMnnxW@@@####@x*iiiiiii**+***********+*+###*;;;;;::;;ii***+***;:,....,,,;i*i;;;::,`.nxzzxnMWn##zzx#i:;,,;,                
                   //  .#*nx*nxMx#nMMW@@@#@#@M+i;iiiii*+++++**+*+++**+###+iii;;;;;;;;iii**#+i:::,.,,,..,,;ii;,,.``#xnzzzi#xWxxnzn#+::;:;+`               
                   //  **#x#+nxMxz@WW@@@@###@M+*iii;ii++*++***+++##*+##*iii;iii;;;;;i;;;i**;,,,,,,:,..`.,:;;i;:.`:MMn+#z*i*zMMMx#*+::;;,#.               
                   // `i+z#*nxMWnMxMMWWW@####W#i;ii;;iii**ii**+***++*#ii;i;:;;iiiii;;;;;i;;::..,,:,,.`...,;;::,`:n@MnzzMzi###nn#n#;::;n:+`               
                   // .#zx*zMM@Mx#znxWW@@####@z*iii;;;;i*ii;*i+i*++**iii;:;;:;iiiiiiii;;;;:::,..,..,`.```.,::,``#W#@Mz#++ii#nnn#+##,,:#++`               
                   // `*zn+xxW@z+#xMWW@@@@#@#@x+*iiiiii*iii;i*****iiiii;;;:,::;;;;;;;;;;;i;::,,,,..``..``.,:,.`;x@@@Mz#*+*i#nxxnz*;i`:***`               
                   //  +##zxMW@++zxMWWW@@#@@##Mz+**;ii;ii;;iiii*+**i;;;;i;:::;;::;;;i;;;;i;:::,,,.`.`.....,:,.,zW@W@Wn#+#+;;#nxxx*:*.,*+i`               
                   //  :*#zxMWW+#nxMMW@@@@#@##Wn#+***ii;i;;;**iiiiiiiii;i;;;;;:::;:;::ii;ii;;:,,,.````.`..,,,:#M@WWWWn#;:in#;#nnx*:i::zz:                
                   //  ,nzxMW@x#nxMMWWW@@@@@@@@xz#++**iiiiiiiiiii***i*i*iiii;;;;i:::;ii;iii;;;,,..```.`.,,,,:*x@@WWMWn#+i:*Wni##+z:::ini`                
                   //  `MnnxW@MzxMMMMMW@@@@@@@#Mnz#+#+i**iiiiii*ii****iiii;;;;;;:;;i;;i;ii*i;;:,.````.,,,:;;i#M@@MMMMn#ii,:xWzii+z*,:#+.                 
                   //   nxxxWWWzxxMMMMWW@@@@@@#@xz###+++*i**ii;**+++****i*ii*iii;i;;;;ii**ii;;::,,...,::;:;i#xWWMMMMM#i+**,iWWxz**#,:n:`                 
                   //   n@xnM@MzxMMMMMWW@@@@@@@#Wn###+#+++**+*********++****+ii*i*iii****i**iii:;:,,,,:;;;*zxW@WMMMx*;#+ix;iMWMzzi#;;#.                  
                   //   zWxxW@n#nMMMMWWWWW@@@@@#@Mn####+#++#+#+*i*+****++**+**+*********++##++ii:;:::;;ii*zxW@@@WWniii+i;n+nxMxzn#*:+*`                  
                   //   ,MMMWWzznxMMWWWWWW@@@@@@#Wxnz##+###+z#+*****+*****++*++++#+++#z#nnnxnz++**;;;ii*+zMW@#@@Wx+ii*n##x#nxMMxxn+,n#.                  
                   //    iMMMWznnxMMMMWWMWWWW@@@@@Mnzz+##z####zz####+++++*+++++#n#znxxnMWMMMxzz##****+*znM@@##@Wn**i++xxxnnnnxMxMxz*M+.                  
                   //    `+xWMzznnxxMMWWMWWWW@@@@#@xz#########z#####+++**++*+**+#zznnMWWMxMxnznz#++*#znMW@@@@@M#+z+zznnMMMnnxMMWWM#xn:`                  
                   //     ,zWMznxzxnxMWWW@WWW@W@@@@Wxz+##+#####zz##z#zz###++*+###+#zzxMxnxxxnzz#z##zxMWW@@@@@ni++z#nxxnMMzMMxxxxxxzx*`                   
                   //      ixMzxxnxxMMWMWWWWWWWW@@@@Wnz#++#+##zznnzzzzzzznz#zz###z#zzxxnnxnznnnnnxMMWW@@@@Wn+*#z#xMxWxzzWMMxnnnMMnxz,                    
                   //      `*xzxMnnxxMMMWWMWWWWW@@@@@Wxn##++++#znnznnnnnnnnnnnnnnnnnxxxxxxxxxxxMWWWW@@@@Wnz+nz#nxxWMMnMMMMM#znzxxMn:                     
                   //       .*nnMxxxMMMMWMMWWWMWW@W@@@Wxnz#+**+zzznnxxxxnnxnnxxxxxxxxxxMMMMWWWWWW@@@@@x#z##zxWxxMMMMMMxMxnxxnnnxMn:                      
                   //        .+nMWMMxMMMMMMWMWMWWWWW@@@@Mnz###+++#znnxxxMMMMMMMMMMMMMMWWWWW@@@@@@@@xz*nxxxMMxWWWMMxMMnnnxnnxxnnMn:                       
                   //         .#xMMMMMMMMMWWWWWWWWMM@@@W@Mxnzz####++#nnxxMMMMWWWWWWWW@@@@@@@@@@@MnznnxxxMxMWMWMxxMMMnxnxxxxxMxxn;                        
                   //          .#xxMMWWWMWWWWWWMWWMW@WWWW@WWnnzzz#######znMMMWWWW@@@@@@@@#@@WMxnzxxMnxMMMMMMMMMxWWWxnMxxxxxxWxx;`                        
                   //           `*nxMMW@WWWWWWWWWMWWWWWWWWW@@Mnznzzzz#z####zznxMxMMMWWWMMxnxxMMWMxxxMMWWWWWWWWWWWWxxnMMxMxxMMn:`                         
                   //            `*nMMWWW@WWWWWWWMWWWWWWWWM@WW@Mxnzzzz#######z#zzzznnxxMMMMMWMW@WW@WWWWWWWWW@@@WWMMMnMMxxnxMx;                           
                   //             `;nMWW@@WWWW@WWWMWWWMWWWMWWWWWWMxxz########zzznxxMMMWWW@@@@@@@@@WWW@W@@@@@WWWMMxnxxMMnxMMni`                           
                   //               .+xMWWWWWWWWWWMWWWWWWWWMWWMMWWMWWMMxnnzzznxMMMMWWW@@@@@WW@@WWW@@@@@WWWWMxMMWWWWWMWMMxWxi`                            
                   //                `:#MWWWWWWWWWMMWWWWWWWMWWMWMWWMMMMMMWMxMWWWWWWWWWWW@@@@@@@@WWWWW@@@WWWMWWWWWWWMWWMMx#;`                             
                   //                  `;#M@@WWWWWMMWWWWWWWWWWWWMMW@WMWWMWWWWWWWWWW@@@@@@@@@@@W@@@@@@@@W@@WWWWMMMMMMWxx#;.                               
                   //                    `:+xW@@@W@WWW@@WWWWWWWWWMW@@@W@@@@@@@@@@@@@@@@@@@@@@@@@@@@@WW@@WWMWxMWWWMWWWz:`                                 
                   //                      `:+nW@@@@@@@@@@@@@@WMMMMW@@@@@@@@@@@#@@@#@@@@#@@@@@@@WWW@WWWWWWWWWMMWWWMn*.                                   
                   //                         .:+nMW@@@@@@@@@W@WWWWWW@@@@@########@@@@@@@@@@@@@@@@@@WWWWWWWWWMW@Mzi,`                                    
                   //                            `,i#xW@@@@@WWW@@@@@@WW@@@@@@@@@@@@WWWWWW@WWW@@@@@@@@@@@WW@WW@M+:`                                       
                   //                                `:+xW@@@@@@@@@WW@WW@WWWWWWWWWWWWWWWWWW@WW@@@@W@@WWWW@WWn*,`                                         
                   //                                   .;#xW@@@@W@@@WWW@@@WWMMMxMWWWWWWWWW@@@@@@@@@W@@Wxz*:`                                            
                   //                                      .;+nMMWW@@@@@@@WWWWWWWW@W@W@@@@@@@@@@@@WMxz*;.`                                               
                   //                                         `.:i*+#nxW@@@@@@@@@@@@@@@@@@@@@@Wxz+i,.`                                                   
                   //                                                ```.,;;::;i+zz#+++#zzz#+i:.`                                                        