package pl.mmilek.kuwahara.app;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class KuwaharaController {

    @PostMapping("/kuwahara")
    public static void transformImage(@RequestParam String file, @RequestParam Integer filterSize) {
        System.out.println(file);
        System.out.println(filterSize);
    }
}
